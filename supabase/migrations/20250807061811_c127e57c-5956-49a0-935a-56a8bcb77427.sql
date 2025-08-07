-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quotes table
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for categories
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify categories" 
ON public.categories 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for quotes
CREATE POLICY "Quotes are viewable by everyone" 
ON public.quotes 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify quotes" 
ON public.quotes 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create trigger for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name, description) VALUES 
('Inspirational', 'Quotes that inspire and motivate'),
('Life', 'Quotes about life and living'),
('Success', 'Quotes about achieving success'),
('Love', 'Quotes about love and relationships'),
('Wisdom', 'Quotes that share wisdom and knowledge');

-- Insert sample quotes
INSERT INTO public.quotes (quote, author, description, category_id) VALUES 
('The only way to do great work is to love what you do.', 'Steve Jobs', 'A motivational quote about passion and work', (SELECT id FROM public.categories WHERE name = 'Success')),
('Life is what happens to you while you''re busy making other plans.', 'John Lennon', 'A reflection on the unpredictability of life', (SELECT id FROM public.categories WHERE name = 'Life')),
('The future belongs to those who believe in the beauty of their dreams.', 'Eleanor Roosevelt', 'An inspiring quote about dreams and future', (SELECT id FROM public.categories WHERE name = 'Inspirational')),
('Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.', 'Lao Tzu', 'A quote about the power of love', (SELECT id FROM public.categories WHERE name = 'Love')),
('The only true wisdom is in knowing you know nothing.', 'Socrates', 'A philosophical quote about knowledge and humility', (SELECT id FROM public.categories WHERE name = 'Wisdom')),
('Innovation distinguishes between a leader and a follower.', 'Steve Jobs', 'A quote about leadership and innovation', (SELECT id FROM public.categories WHERE name = 'Success')),
('In the end, we will remember not the words of our enemies, but the silence of our friends.', 'Martin Luther King Jr.', 'A powerful quote about friendship and courage', (SELECT id FROM public.categories WHERE name = 'Life')),
('It is during our darkest moments that we must focus to see the light.', 'Aristotle', 'An inspirational quote about perseverance', (SELECT id FROM public.categories WHERE name = 'Inspirational')),
('Love all, trust a few, do wrong to none.', 'William Shakespeare', 'Wisdom about love and relationships', (SELECT id FROM public.categories WHERE name = 'Love')),
('The greatest glory in living lies not in never falling, but in rising every time we fall.', 'Nelson Mandela', 'A quote about resilience and strength', (SELECT id FROM public.categories WHERE name = 'Wisdom'));