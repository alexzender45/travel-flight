import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as _ from 'lodash';
import axios from 'axios';
import { EnvironmentService } from '../configs';

const env = EnvironmentService.getAll();

@Injectable()
export class SearchService {

  public async searchFlight(departure: string, arrival: string, date: string) {
    try {
        // Ensure all parameters are provided
        if (!departure || !arrival || !date) {
            throw new Error("All parameters (departure, arrival, date) are required.");
        }

        const response = await axios.get('https://flight-fare-search.p.rapidapi.com/v2/flights/', {
            headers: {
                'X-RapidAPI-Key': env.api_key
            },
            params: {
                from: departure,
                to: arrival,
                date: date
            }
        });

        if (response.data) {
            return response.data;
        } else {
            throw new Error('No flights found.');
        }
    }
    catch (e) {
        console.log(e);
        throw new InternalServerErrorException(`Error fetching flight data: ${e.message}`);
    }
}
  }
