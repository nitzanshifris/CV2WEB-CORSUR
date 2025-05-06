export interface Theme {
  id: string;
  name: string;
  description?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    headings: string;
  };
  typography: {
    heading: string;
    body: string;
    accent: string;
    sizes: {
      h1: string;
      h2: string;
      h3: string;
      body: string;
      small: string;
    };
  };
  layout: {
    maxWidth: string;
    spacing: {
      section: string;
      element: string;
    };
    useIcons: boolean;
    borderRadius: string;
    shadows: {
      light: string;
      medium: string;
      strong: string;
    };
  };
  variants?: {
    [key: string]: Partial<Theme>;
  };
}
