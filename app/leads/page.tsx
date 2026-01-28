// src/app/leads/page.tsx
import { getCollections } from "@/lib/mongodb";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


type Lead = {
  _id: string;
  name?: string;
  phone?: string;
  email?: string;
  subscription?: string;
};


async function getLeads(): Promise<Lead[]> {
  const { leads } = await getCollections();

  const data = await leads
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return data.map((lead) => ({
    ...lead,
    _id: lead._id.toString(),
  })) as Lead[];
}

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <h1>Leads</h1>
      <ul>
        {leads.map((lead: any) => (
          <li key={lead._id}>
            {lead.name} - {lead.phone}
          </li>
        ))}
      </ul>

      <div>
        <div className="">
            <Table className="">
            <TableCaption>Incoming leads</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Lead Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subscription</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>

                {leads.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No leads yet
              </TableCell>
            </TableRow>
          )}

                {leads.map((lead) => (
                    <TableRow key={lead._id}>
                    <TableCell className="font-medium">
                        {lead.name ?? "—"}
                    </TableCell>
                    <TableCell>{lead.phone ?? "—"}</TableCell>
                    <TableCell>{lead.email ?? "—"}</TableCell>
                    <TableCell>{lead.subscription ?? "Free"}</TableCell>
                    </TableRow>
                ))}
                {/* <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
                </TableRow> */}
            </TableBody>
        </Table>
        </div>
        
      </div>
    </div>
    
  );
}
