/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary (Gold)",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary (Ice Blue)",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent (Ember)",
        },
      ],
    },
    {
      fieldName: "gameTitle",
      type: "string",
      required: true,
      label: "Game Title",
      minLength: 1,
      maxLength: 80,
    },
    {
      fieldName: "gameSubtitle",
      type: "string",
      required: false,
      label: "Title Subtitle (e.g. Chapter name)",
      maxLength: 120,
    },
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "Tagline / North Star Line",
      maxLength: 200,
    },
    {
      fieldName: "newGameLabel",
      type: "string",
      required: false,
      label: "Main Menu: New Game Label",
      maxLength: 40,
    },
    {
      fieldName: "continueLabel",
      type: "string",
      required: false,
      label: "Main Menu: Continue Label",
      maxLength: 40,
    },
    {
      fieldName: "settingsLabel",
      type: "string",
      required: false,
      label: "Main Menu: Settings Label",
      maxLength: 40,
    },
    {
      fieldName: "creditsLabel",
      type: "string",
      required: false,
      label: "Main Menu: Credits Label",
      maxLength: 40,
    },
    {
      fieldName: "creditsBody",
      type: "string",
      required: false,
      label: "Credits Body Text",
      maxLength: 600,
    },
    {
      fieldName: "startingCoins",
      type: "number",
      required: false,
      label: "Starting Coins",
      min: 0,
      max: 9999,
    },
    {
      fieldName: "textSpeed",
      type: "enum",
      required: false,
      label: "Default Text Speed",
      options: ["slow", "normal", "fast"],
    },
    {
      fieldName: "showMobileControls",
      type: "boolean",
      required: false,
      label: "Show On-Screen Mobile Controls",
    },
  ],
};