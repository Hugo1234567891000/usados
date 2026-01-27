/*
  # Fix Tour Rooms Policy for Demo
  
  Temporarily allow public inserts for demo purposes
*/

DROP POLICY IF EXISTS "Authenticated users can create rooms" ON tour_rooms;

CREATE POLICY "Anyone can create rooms for demo"
  ON tour_rooms FOR INSERT
  TO public
  WITH CHECK (true);