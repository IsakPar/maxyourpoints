import { StructureBuilder } from 'sanity/desk'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('article').title('Articles'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('subcategory').title('Subcategories')
    ]) 