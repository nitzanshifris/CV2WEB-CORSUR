export interface Block {
  type: string;
  id: string;
  content?: string;
  heading?: string;
  subheading?: string;
  items?: Array<{ label: string; value: number }>;
  entries?: Array<{
    title: string;
    organization: string;
    period: string;
    description?: string;
  }>;
  email?: string;
  phone?: string;
  style?: string;
  imageFilter?: string;
  minimal?: boolean;
  creative?: boolean;
}

export interface Section {
  id: string;
  type: string;
  blocks: Block[];
  className?: string;
  compact?: boolean;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  sections: Section[];
  styles: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    headingFont?: string;
    bodyFont?: string;
    borderRadius?: string;
    spacing?: number;
  };
}
