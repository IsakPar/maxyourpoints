export default {
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    { name: "title", type: "string", title: "Title" },
    { name: "slug", type: "slug", title: "Slug", options: { source: "title" } },
    { name: "summary", type: "text", title: "Summary" },
    { name: "content", type: "array", title: "Content", of: [{ type: "block" }] },
    { name: "date", type: "datetime", title: "Published Date" },
    { name: "author", type: "string", title: "Author" },
    { name: "readTime", type: "string", title: "Read Time" },
    { name: "category", type: "reference", to: [{ type: "category" }] },
    {
      name: "coverImage",
      type: "image",
      title: "Cover Image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    },
  ],
} 