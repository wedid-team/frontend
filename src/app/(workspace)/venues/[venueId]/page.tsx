import { notFound } from "next/navigation";
import { VenueDetail } from "../../../../../features/venues/components/venueDetail";
import { venues } from "../../../../../features/venues/venueData";

export function generateStaticParams() {
  return venues.map((venue) => ({ venueId: venue.id }));
}

export default async function VenueDetailRoute({
  params,
}: {
  params: Promise<{ venueId: string }>;
}) {
  const { venueId } = await params;
  const venue = venues.find((entry) => entry.id === venueId);
  if (!venue) notFound();
  return <VenueDetail venue={venue} />;
}
