import type {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('KUJISAN Content')
    .items([
      S.listItem()
        .title('People by Generation')
        .icon(() => '👥') 
        .child(
          S.list()
            .title('Generations')
            .items([
              S.listItem()
                .title('Gen 1 (Roots)')
                .child(S.documentList().title('Gen 1 (Roots)').schemaType('person').filter('_type == "person" && generation == 1')),
              
              S.listItem()
                .title('Gen 2 (Children)')
                .child(S.documentList().title('Gen 2').schemaType('person').filter('_type == "person" && generation == 2')),
              S.listItem()
                .title('Gen 3 (Grandchildren)')
                .child(S.documentList().title('Gen 3').schemaType('person').filter('_type == "person" && generation == 3')),

              S.listItem()
                .title('Gen 4+ (Future)')
                .child(S.documentList().title('Gen 4+').schemaType('person').filter('_type == "person" && generation >= 4')),

              S.divider(),

              S.listItem()
                .title('Unsorted / No Gen')
                .icon(() => '⚠️')
                .child(S.documentList().title('Unsorted People').schemaType('person').filter('_type == "person" && !defined(generation)')),
            ])
        ),

      S.divider(),

      // --- STANDARD LISTS ---
      S.documentTypeListItem('person').title('All People'),
      S.documentTypeListItem('family').title('Families'),
      S.documentTypeListItem('union').title('Unions'),
      
      S.divider(),

      // --- MEDIA & SETTINGS ---
      S.documentTypeListItem('photoAlbum').title('Photo Albums'),
      S.documentTypeListItem('siteSettings').title('Site Settings'),
    ])