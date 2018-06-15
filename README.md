[![Codacy Badge](https://api.codacy.com/project/badge/Grade/790815d737904c95a0a8ec5ab772d429)](https://www.codacy.com/app/amalricBzh/multiUploader?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=amalricBzh/multiUploader&amp;utm_campaign=Badge_Grade)

# multiUploader
JS script to upload several files to a php server


1. Copy the files to your server
2. Update your php.ini settings in order to allow bigger files to be transfered (default 2Mo is too small). For ordinary images, 10Mo must be enought.

```
    post_max_size = 200M
    file_uploads = On
    upload_max_filesize = 200M
```

3. Update ph-adm.php and change the sha256 password to what you want.

3. Start your php server => It's OK !

To manage and download sent files, go to ph-adm.php

#Todo

1. Config file (and config service)
2. Better source organisation
2. Better loggin system
3. Use a micro-framework as Slim
