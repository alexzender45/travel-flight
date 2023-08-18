import {
  Controller,
  HttpStatus,
  Inject,
  Get,
  Query,
} from '@nestjs/common';
import { BaseService } from '../base';
import { SearchService } from './search.service';

@Controller('flight')
export class SearchController {
  @Inject(SearchService)
  private readonly searchService: SearchService;
  @Inject(BaseService)
  private readonly baseService: BaseService;

  @Get('/search')
  public async search(
    @Query('departure') departure: string,
    @Query('arrival') arrival: string,
    @Query('date') date: string,
  ) {
    const data = await this.searchService.searchFlight(
      departure,
      arrival,
      date
    );

    return this.baseService.transformResponse(
      'Flight search successful',
      data.results,
      HttpStatus.OK,
    );
  }
}
