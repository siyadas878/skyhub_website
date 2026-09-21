import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lxryqeomeomssenymqdp.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getAdminClient() {
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
  }
  return createClient(supabaseUrl, serviceRoleKey);
}

export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('product_inquiries')
      .select(`*, product:products(*)`)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    const inquiryId = crypto.randomUUID();

    const inquiryPayload = {
      id: inquiryId,
      product_id: body.product_id || null,
      customer_name: body.customer_name,
      phone: body.phone,
      email: body.email || null,
      message: body.message || '',
      source: body.source || 'WhatsApp',
      status: body.status || 'New'
    };

    const { data, error } = await supabase
      .from('product_inquiries')
      .insert([inquiryPayload])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, inquiry: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
