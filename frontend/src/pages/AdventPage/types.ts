export interface AdventEntry {
  date: string;
  status: 'coming' | 'published' | 'finished';
  title?: string;
  description?: string;
  link?: string;
  linkLabel?: string;
}
