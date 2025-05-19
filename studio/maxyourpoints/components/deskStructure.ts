import { StructureBuilder } from 'sanity/structure'

export default (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('article').title('Articles'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('subcategory').title('Subcategories'),
    ]) 