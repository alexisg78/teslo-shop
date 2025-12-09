import { Response } from 'express';
import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';

import { fileFilter, fileNamer } from './helpers';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){

    const path = this.filesService.getStaticProductImage( imageName );

    res.sendFile( path )
   
    // return path;
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }) )
  upLoadProductImages( 
    @UploadedFile() file: Express.Multer.File 
  ){

    if ( !file ) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    const secureUrl = `${ file.filename }`

    return { secureUrl };
  }

}
