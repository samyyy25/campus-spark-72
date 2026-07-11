
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('super_admin', 'college_admin', 'faculty', 'student');
CREATE TYPE public.event_category AS ENUM ('technical','cultural','sports','academic','entrepreneurship','innovation');
CREATE TYPE public.opportunity_status AS ENUM ('draft','published','closed','cancelled');
CREATE TYPE public.registration_status AS ENUM ('registered','waitlisted','attended','cancelled','selected','rejected');
CREATE TYPE public.activity_type AS ENUM ('event','workshop','seminar','internship','placement','club');
CREATE TYPE public.notice_category AS ENUM ('academic','examination','placement','internship','holiday','emergency','general');

-- ============ COLLEGES / DEPARTMENTS ============
CREATE TABLE public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.colleges TO anon, authenticated;
GRANT ALL ON public.colleges TO service_role;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Colleges are viewable by everyone" ON public.colleges FOR SELECT USING (true);

CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.departments TO anon, authenticated;
GRANT ALL ON public.departments TO service_role;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Departments viewable by everyone" ON public.departments FOR SELECT USING (true);

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  phone TEXT,
  college_id UUID REFERENCES public.colleges(id),
  department_id UUID REFERENCES public.departments(id),
  enrollment_no TEXT,
  branch TEXT,
  year INT,
  semester INT,
  cgpa NUMERIC(4,2),
  skills TEXT[],
  resume_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by all authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  college_id UUID REFERENCES public.colleges(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','college_admin','faculty'))
$$;

-- ============ EVENTS ============
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES public.colleges(id),
  title TEXT NOT NULL,
  description TEXT,
  banner_url TEXT,
  category event_category NOT NULL DEFAULT 'technical',
  venue TEXT,
  organizer TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  registration_deadline TIMESTAMPTZ,
  max_seats INT,
  registration_link TEXT,
  status opportunity_status NOT NULL DEFAULT 'published',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events viewable by all" ON public.events FOR SELECT USING (true);
CREATE POLICY "Staff can insert events" ON public.events FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update events" ON public.events FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can delete events" ON public.events FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- ============ WORKSHOPS ============
CREATE TABLE public.workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES public.colleges(id),
  title TEXT NOT NULL,
  description TEXT,
  banner_url TEXT,
  speaker TEXT,
  company TEXT,
  workshop_date TIMESTAMPTZ NOT NULL,
  duration_hours NUMERIC,
  venue TEXT,
  certificate_available BOOLEAN DEFAULT false,
  max_seats INT,
  registration_link TEXT,
  status opportunity_status NOT NULL DEFAULT 'published',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.workshops TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.workshops TO authenticated;
GRANT ALL ON public.workshops TO service_role;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workshops viewable by all" ON public.workshops FOR SELECT USING (true);
CREATE POLICY "Staff manage workshops ins" ON public.workshops FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff manage workshops upd" ON public.workshops FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff manage workshops del" ON public.workshops FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- ============ SEMINARS ============
CREATE TABLE public.seminars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES public.colleges(id),
  title TEXT NOT NULL,
  description TEXT,
  banner_url TEXT,
  speaker TEXT,
  organization TEXT,
  topic TEXT,
  seminar_date TIMESTAMPTZ NOT NULL,
  venue TEXT,
  capacity INT,
  registration_link TEXT,
  status opportunity_status NOT NULL DEFAULT 'published',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.seminars TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.seminars TO authenticated;
GRANT ALL ON public.seminars TO service_role;
ALTER TABLE public.seminars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Seminars viewable by all" ON public.seminars FOR SELECT USING (true);
CREATE POLICY "Staff seminars ins" ON public.seminars FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff seminars upd" ON public.seminars FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff seminars del" ON public.seminars FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- ============ INTERNSHIPS ============
CREATE TABLE public.internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES public.colleges(id),
  company_name TEXT NOT NULL,
  logo_url TEXT,
  role TEXT NOT NULL,
  description TEXT,
  stipend TEXT,
  duration TEXT,
  location TEXT,
  mode TEXT,
  eligibility TEXT,
  required_skills TEXT[],
  application_deadline TIMESTAMPTZ,
  apply_link TEXT,
  status opportunity_status NOT NULL DEFAULT 'published',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.internships TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.internships TO authenticated;
GRANT ALL ON public.internships TO service_role;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internships viewable by all" ON public.internships FOR SELECT USING (true);
CREATE POLICY "Staff internships ins" ON public.internships FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff internships upd" ON public.internships FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff internships del" ON public.internships FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- ============ PLACEMENT DRIVES ============
CREATE TABLE public.placement_drives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES public.colleges(id),
  company_name TEXT NOT NULL,
  logo_url TEXT,
  role TEXT NOT NULL,
  package TEXT,
  job_location TEXT,
  eligibility TEXT,
  required_skills TEXT[],
  selection_process TEXT,
  registration_deadline TIMESTAMPTZ,
  drive_date TIMESTAMPTZ,
  status opportunity_status NOT NULL DEFAULT 'published',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.placement_drives TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.placement_drives TO authenticated;
GRANT ALL ON public.placement_drives TO service_role;
ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Drives viewable by all" ON public.placement_drives FOR SELECT USING (true);
CREATE POLICY "Staff drives ins" ON public.placement_drives FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff drives upd" ON public.placement_drives FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff drives del" ON public.placement_drives FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- ============ NOTICES ============
CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES public.colleges(id),
  title TEXT NOT NULL,
  description TEXT,
  category notice_category NOT NULL DEFAULT 'general',
  attachment_url TEXT,
  is_pinned BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notices TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.notices TO authenticated;
GRANT ALL ON public.notices TO service_role;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notices viewable by all" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Staff notices ins" ON public.notices FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff notices upd" ON public.notices FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff notices del" ON public.notices FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- ============ CLUBS ============
CREATE TABLE public.clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES public.colleges(id),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  logo_url TEXT,
  banner_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.clubs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.clubs TO authenticated;
GRANT ALL ON public.clubs TO service_role;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clubs viewable by all" ON public.clubs FOR SELECT USING (true);
CREATE POLICY "Staff clubs ins" ON public.clubs FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff clubs upd" ON public.clubs FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff clubs del" ON public.clubs FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE TABLE public.club_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (club_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.club_members TO authenticated;
GRANT ALL ON public.club_members TO service_role;
ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members viewable by authenticated" ON public.club_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users join clubs themselves" ON public.club_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users leave own membership" ON public.club_members FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ REGISTRATIONS (unified for events/workshops/seminars/internships/placements) ============
CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  activity_id UUID NOT NULL,
  status registration_status NOT NULL DEFAULT 'registered',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, activity_type, activity_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registrations TO authenticated;
GRANT ALL ON public.registrations TO service_role;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own registrations" ON public.registrations FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY "Users register themselves" ON public.registrations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own registrations" ON public.registrations FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY "Users delete own registrations" ON public.registrations FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ CERTIFICATES ============
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuer TEXT,
  activity_type activity_type,
  activity_id UUID,
  certificate_url TEXT,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own certificates" ON public.certificates FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY "Staff issue certificates" ON public.certificates FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));

-- ============ NOTIFICATIONS ============
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- ============ SIGNUP TRIGGER (profile + student role) ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger for profiles
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
