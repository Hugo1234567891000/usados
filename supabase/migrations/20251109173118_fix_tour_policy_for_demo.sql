/*
  # Fix Tour Policy for Demo
  
  Temporarily allow public inserts for demo purposes
*/

DROP POLICY IF EXISTS "Authenticated users can create tours" ON property_3d_tours;

CREATE POLICY "Anyone can create tours for demo"
  ON property_3d_tours FOR INSERT
  TO public
  WITH CHECK (true);