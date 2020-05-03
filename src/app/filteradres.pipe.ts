import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterAdres'
})
export class FilteradresPipe implements PipeTransform {

  transform(users: any, adres: string): any {
    if (!users) {
      return users;
    } else {
      if (!adres) {
        return users;
      } else if (adres !== undefined) {
        return users.filter((user) => {
          return user.adres.toLowerCase().includes(adres.toLowerCase());
        });
      }
    }
  }

}
