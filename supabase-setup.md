# Supabase Setup for Zeal Forum Authentication

This guide provides instructions for setting up Google OAuth and the profiles table in your Supabase project to enable role-based authentication.

## 1. Profiles Table Setup

Create a new table in Supabase with the following SQL:

```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('admin', 'moderator', 'user', 'guest')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_sign_in TIMESTAMP WITH TIME ZONE,
  banned BOOLEAN DEFAULT false,
  ban_reason TEXT
);

-- Set up Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Policy for users to view any profile
CREATE POLICY "Profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

-- Policy for users to update only their own profile
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy for users to insert their own profile
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 2. Set Up Google OAuth in Supabase

1. Go to your Supabase project dashboard and navigate to **Authentication** > **Providers**
2. Find and enable **Google** provider
3. You'll need to set up OAuth credentials in Google Cloud Console:

   a. Go to [Google Cloud Console](https://console.cloud.google.com/)
   b. Create a new project or use an existing one
   c. Navigate to **APIs & Services** > **Credentials**
   d. Click **Create Credentials** > **OAuth client ID**
   e. Set up the OAuth consent screen if prompted
   f. For Application type, select **Web application**
   g. Add your Supabase redirect URL: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   h. Add your local development redirect URL: `http://localhost:5173/auth/callback`
   i. Copy the Client ID and Client Secret

4. Return to Supabase and enter the Google Client ID and Client Secret
5. Save the configuration

## 3. Environment Variables

Make sure you have these environment variables in your `.env` file:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Role-Based Authorization Rules

Implement these roles in your application:

| Role      | Permissions |
|-----------|-------------|
| `admin`   | Full access to all features, including user management, moderation, and configuration |
| `moderator` | Can moderate content, approve posts, but cannot change site settings |
| `user`    | Standard user permissions - can create threads/posts in non-restricted areas |
| `guest`   | Read-only access (users not logged in) |

## 5. Testing the Setup

After implementing the authentication flow, you should be able to:

1. Sign in with Google
2. Create a new profile automatically on first sign-in
3. Access the role field to determine user permissions
4. Update user profiles

## 6. Making a User an Admin

To promote a user to admin role after they've signed up, run this SQL in the Supabase SQL editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'user-uuid-here';
```

Replace `user-uuid-here` with the actual UUID of the user you want to promote.
