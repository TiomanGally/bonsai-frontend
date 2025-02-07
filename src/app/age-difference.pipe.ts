import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'ageDifference'
})
export class AgeDifferencePipe implements PipeTransform {
  transform(birthDate: string | Date): string {
    if (!birthDate) return 'Unbekannt';

    const birth = new Date(birthDate);
    const today = new Date();

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} Years, ${months} Months`;
  }
}
