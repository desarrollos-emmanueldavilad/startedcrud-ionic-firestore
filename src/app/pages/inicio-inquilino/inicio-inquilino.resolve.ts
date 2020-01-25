import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot} from '@angular/router';
import { CompletarRegistroService } from 'src/app/services/completar-registro.service';

@Injectable()
export class InquilinoProfileResolver implements Resolve<any> {

  constructor(private inquilinoProfileService: CompletarRegistroService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const reservas = route.paramMap.get('profileInfluencer');
    return this.inquilinoProfileService.getInquilino();
  }
}
