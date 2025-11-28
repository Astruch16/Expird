import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Supabase with service role for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Use service role key in production
);

export async function POST(request: NextRequest) {
  try {
    // This endpoint would be called by a cron job to check and send follow-up reminders
    // For now, it fetches due follow-ups and sends email reminders

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get follow-ups due today that haven't been sent
    const { data: followUps, error } = await supabase
      .from('follow_ups')
      .select(`
        *,
        listing:listings(*),
        profile:profiles(*)
      `)
      .eq('sent', false)
      .gte('scheduled_date', today.toISOString())
      .lt('scheduled_date', tomorrow.toISOString());

    if (error) {
      console.error('Error fetching follow-ups:', error);
      return NextResponse.json({ error: 'Failed to fetch follow-ups' }, { status: 500 });
    }

    if (!followUps || followUps.length === 0) {
      return NextResponse.json({ message: 'No follow-ups due today' });
    }

    const results = [];

    for (const followUp of followUps) {
      const listing = followUp.listing;
      const profile = followUp.profile;

      if (!profile?.email || !listing) continue;

      try {
        await resend.emails.send({
          from: 'ExpiredLeads Pro <notifications@expiredleads.pro>', // Update with your verified domain
          to: profile.email,
          subject: `Follow-up Reminder: ${listing.address}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 8px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #818cf8; margin: 0;">ExpiredLeads Pro</h1>
                <p style="color: #94a3b8; margin-top: 8px;">Follow-up Reminder</p>
              </div>

              <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="margin: 0 0 16px 0; color: #f1f5f9;">Time to follow up!</h2>
                <p style="color: #94a3b8; margin: 0;">You scheduled a follow-up for the following listing:</p>
              </div>

              <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 12px 0; color: #818cf8;">${listing.address}</h3>
                <p style="margin: 0; color: #94a3b8;">${listing.city}${listing.neighborhood ? `, ${listing.neighborhood}` : ''}</p>

                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #334155;">
                  <table style="width: 100%; color: #e2e8f0;">
                    <tr>
                      <td style="padding: 4px 0; color: #94a3b8;">Type:</td>
                      <td style="padding: 4px 0; text-transform: capitalize;">${listing.listing_type}</td>
                    </tr>
                    ${listing.price ? `
                    <tr>
                      <td style="padding: 4px 0; color: #94a3b8;">Price:</td>
                      <td style="padding: 4px 0;">$${listing.price.toLocaleString()}</td>
                    </tr>
                    ` : ''}
                    ${listing.owner_name ? `
                    <tr>
                      <td style="padding: 4px 0; color: #94a3b8;">Owner:</td>
                      <td style="padding: 4px 0;">${listing.owner_name}</td>
                    </tr>
                    ` : ''}
                    ${listing.owner_phone ? `
                    <tr>
                      <td style="padding: 4px 0; color: #94a3b8;">Phone:</td>
                      <td style="padding: 4px 0;">${listing.owner_phone}</td>
                    </tr>
                    ` : ''}
                  </table>
                </div>
              </div>

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/listings/${listing.id}"
                   style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
                  View Listing
                </a>
              </div>

              <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #334155; text-align: center; color: #64748b; font-size: 12px;">
                <p>You're receiving this because you scheduled a follow-up in ExpiredLeads Pro.</p>
              </div>
            </div>
          `,
        });

        results.push({ followUpId: followUp.id, status: 'sent' });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        results.push({ followUpId: followUp.id, status: 'failed', error: emailError });
      }
    }

    return NextResponse.json({
      message: `Processed ${followUps.length} follow-ups`,
      results
    });

  } catch (error) {
    console.error('Error in send-follow-up:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET endpoint to check follow-ups status (for testing)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('follow_ups')
      .select('*, listing:listings(address, city)')
      .eq('sent', false)
      .order('scheduled_date', { ascending: true })
      .limit(10);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch follow-ups' }, { status: 500 });
    }

    return NextResponse.json({ followUps: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
