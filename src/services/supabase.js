import { createClient } from '@supabase/supabase-js';

const projectUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const projectKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(projectUrl, projectKey);