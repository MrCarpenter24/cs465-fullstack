import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/user';
import { AuthResponse } from '../models/authresponse';
import { BROWSER_STORAGE } from '../storage';

import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {

  constructor(private http: HttpClient, @Inject(BROWSER_STORAGE) private storage: Storage) { }
  url = 'http://localhost:3000/api/trips';
  baseUrl = 'http://localhost:3000/api';

  getTrips() : Observable<Trip[]> {
    //console.log('Inside TripDataService::getTrips');
    return this.http.get<Trip[]>(this.url);
  }

  addTrip(formData: Trip[]) : Observable<Trip[]> {
    console.log('Inside TripDataService::addTrips');
    return this.http.post<Trip[]>(this.url, formData);
  }

  getTrip(tripCode: string) : Observable<Trip[]> {
    // console.log('Inside TripDataService::getTrip');
    return this.http.get<Trip[]>(this.url + '/' + tripCode);
  }

  updateTrip(formData: Trip) : Observable<Trip> {
    console.log('Inside TripDataService::updateTrips');
    return this.http.put<Trip>(this.url + '/' + formData.code, formData);
  }

  // Method to delete a trip by its code
  deleteTrip(tripCode: string) : Observable<Trip> {
    return this.http.delete<Trip>(this.url + '/' + tripCode);
  }

  private handleAuthApiCall(endpoint: string, user: User, passwd: string): Observable<AuthResponse> {
    // console.log('Inside TripDataService::handleAuthAPICall');
    let formData = {
      name: user.name,
      email: user.email,
      password: passwd
    };

    return this.http.post<AuthResponse>(this.baseUrl + '/' + endpoint, formData);
  }

  public login(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthApiCall('login', user, passwd);
  }

  public register(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthApiCall('register', user, passwd);
  }

}
