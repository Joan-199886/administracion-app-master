import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginator2-nav',
  templateUrl: './paginator2.component.html',
})
export class Paginator2Component implements OnInit {

  @Input() paginador: any;
  paginas: number[];

  desde: number;
  hasta: number;


  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    let paginadorActualizado = changes['paginador'];

    if (paginadorActualizado.previousValue) { this.initPaginator(); }

  }

  ngOnInit(): void { this.initPaginator(); }

  private initPaginator(): void {
    this.desde = Math.min(Math.max(1, this.paginador.number - 4), this.paginador.totalPages - 5);
    this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number + 4), 6);

    if (this.paginador.totalPages > 5) {
      this.paginas = new Array(this.hasta - this.desde + 1).fill(0).
        map((_valor, indice) => indice + this.desde);
    } else {
      this.paginas = new Array(this.paginador.totalPages).fill(0).
        map((_valor, indice) => indice + 1);
    }

  }

}
