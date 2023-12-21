import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]

    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should signup', () => {
    const userDetails = {
      "userName": "user1",
      "email": "eucs@gmail.com",
    };

    service.registerUser(userDetails).subscribe((res) => {
      expect(res).toEqual(userDetails);
    });

    const req = httpMock.expectOne('http://localhost:5800/user/register');
    expect(req.request.method).toBe('POST');
    req.flush(userDetails);
  });




});
