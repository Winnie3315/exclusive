import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server';
import { createUser } from '@/actions/user.actions';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local');
  }

  const wh = new Webhook(SIGNING_SECRET);

  const headerPayload = headers();
  const svix_id = (await headerPayload).get('svix-id');
  const svix_timestamp = (await headerPayload).get('svix-timestamp');
  const svix_signature = (await headerPayload).get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, username } = evt.data; // Убраны last_name и image_url

    if (!email_addresses || email_addresses.length === 0) {
      console.error('No email address found in the webhook data.');
      return new Response('Error: Missing email address', { status: 400 });
    }

    const user = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      username: username,
      firstName: first_name,
    };

    try {
      const newUser = await createUser(user);

      if (newUser) {
        const clerk = await clerkClient();

        await clerk.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id,
          },
        });
      }

      console.log('User created successfully:', newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      return new Response('Error: Could not create user', { status: 500 });
    }
  }

  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  return new Response('Webhook received', { status: 200 });
}