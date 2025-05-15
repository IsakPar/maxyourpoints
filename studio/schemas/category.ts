export default {
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "title",
      },
    },
    {
      name: "description",
      type: "text",
      title: "Description",
    },
  ],
} 