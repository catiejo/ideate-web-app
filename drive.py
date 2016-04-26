folder_id = '0B_fqIk0FFWuGdU9KQ3JmdmE2cnc'
file_metadata = {
  'name' : 'photo.jpg',
  'parents': [ folder_id ]
}
media = MediaFileUpload('files/photo.jpg',
                        mimetype='image/jpeg',
                        resumable=True)
file = drive_service.files().create(body=file_metadata,
                                    media_body=media,
                                    fields='id').execute()
print 'File ID: %s' % file.get('id')
