ALTER TABLE public.quotes
ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';

-- RLS Policies for quotes
DROP POLICY "Quotes are viewable by everyone" ON public.quotes;

CREATE POLICY "Quotes are viewable by everyone" 
ON public.quotes 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admins can see all quotes"
ON public.quotes
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Only admins can modify quotes" ON public.quotes;

CREATE POLICY "Only admins can modify quotes" 
ON public.quotes 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));
