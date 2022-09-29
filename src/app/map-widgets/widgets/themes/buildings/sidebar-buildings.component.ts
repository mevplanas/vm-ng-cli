import {
  Component,
  OnChanges,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnInit,
  DoCheck,
} from "@angular/core";
import { QuartersLegend } from "./QuartersLegend";
import { MapWidgetsService } from "../../map-widgets.service";
import Chart from "chart.js";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";

@Component({
  selector: "maps-v-sidebar-buildings",
  templateUrl: "./sidebar-buildings.component.html",
  styleUrls: ["./sidebar-buildings.component.scss"],
  animations: [
    trigger("sidebarToggle", [
      state(
        "s-close",
        style({
          transform: "translate3d(400px,0,0)",
        })
      ),
      state(
        "s-open",
        style({
          transform: "translate3d(0,0,0)",
        })
      ),
      transition("s-open => s-close", animate("100ms ease-in")),
      transition("s-close => s-open", animate("100ms ease-out")),
    ]),
  ],
})
export class SidebarBuildingsComponent implements OnChanges {
  @Input() mainSidebarState;
  @Input() sidebarHeatContent;
  @ViewChild("mChart", { static: false }) heatMonthsChart: ElementRef;
  @ViewChild("pChart", { static: false }) heatPriceChart: ElementRef;
  @ViewChild("cChart", { static: false }) heatClassesChart: ElementRef;

  showCharts: boolean;

  heatingMonthsData: any;
  heatingClassesData: any;
  monthsChart: Chart;
  pricesChart: Chart;
  classesChart: Chart;
  lastHeatingYear: number;

  innerState = "s-close";
  sidebarMonthsState = "s-close";
  sidebarClassesState = "s-close";
  sidebarInfoState = "s-close";
  sidebarQuartersState = "s-close";

  selectionByTypeState = false;

  // chart labels for tooltip
  chartLabels = [];

  quaretrsBorderSybol = QuartersLegend.border;
  quaretrsFillSybol = QuartersLegend;

  renovationProgramUrl =
    "https://vilnius.lt/lt/savivaldybe/aplinkosauga-ir-energetika/daugiabuciu-namu-atnaujinimas-modernizavimas/";

  constructor(
    private cdr: ChangeDetectorRef,
    private mapWidgetsService: MapWidgetsService
  ) {}

  selectBuildingsByType() {
    this.selectionByTypeState = !this.selectionByTypeState;
    this.mapWidgetsService.selectBuildingsByType(
      this.sidebarHeatContent.TIPINIS_PR,
      this.selectionByTypeState
    );
  }

  openSidaberGroup(name: string) {
    switch (name) {
      case "quarters":
        this.sidebarQuartersState = "s-open";
        break;
      case "months":
        this.sidebarMonthsState = "s-open";
        break;
      case "classes":
        this.sidebarClassesState = "s-open";
        break;
      case "info":
        this.sidebarInfoState = "s-open";
        break;
    }

    this.cdr.detectChanges();
  }

  closeSidaberGroup(name: string = "") {
    switch (name) {
      case "quarters":
        this.sidebarQuartersState = "s-close";
        break;
      case "months":
        this.sidebarMonthsState = "s-close";
        break;
      case "classes":
        this.sidebarClassesState = "s-close";
        break;
      case "info":
        this.sidebarInfoState = "s-close";
        break;
      default:
        this.sidebarMonthsState = "s-close";
        this.sidebarClassesState = "s-close";
        this.sidebarInfoState = "s-close";
        this.sidebarQuartersState = "s-close";
    }

    // diselect buildigns by type if their are selected
    if (this.selectionByTypeState) {
      this.selectBuildingsByType();
    }

    // detect changes when closing sidebar group
    this.cdr.detectChanges();
  }

  initHeatMonthsGraphic() {
    const el = this.heatMonthsChart.nativeElement.getContext("2d");
    // tslint:disable-next-line: no-unused-expression
    this.monthsChart && this.monthsChart.clear();
    const datasets = [
      {
        label: `${this.lastHeatingYear}-${this.lastHeatingYear + 1} m.`,
        data: this.initMonthsDataset()[this.lastHeatingYear],
        backgroundColor: ["rgba(150, 106, 236, 0.2)"],
        borderColor: ["rgba(150, 106, 236, 1)"],
        borderWidth: 1,
        pointHoverBackgroundColor: "rgba(255, 255, 255, 1)",
        pointHoverBorderColor: "rgba(150, 106, 236, 1)",
        pointBorderColor: "rgba(255, 255, 255, 1)",
        pointBackgroundColor: "rgba(150, 106, 236, 1)",
        pointHoverRadius: 5,
        pointRadius: 5,
      },
      {
        label: `${this.lastHeatingYear - 1}-${this.lastHeatingYear} m.`,
        data: this.initMonthsDataset()[this.lastHeatingYear - 1],
        backgroundColor: ["rgba(153, 195, 146, 0.2)"],
        borderColor: ["rgba(153, 195, 146, 1)"],
        borderWidth: 1,
        pointHoverBackgroundColor: "rgba(255, 255, 255, 1)",
        pointHoverBorderColor: "rgba(153, 195, 146, 1)",
        pointBorderColor: "rgba(255, 255, 255, 1)",
        pointBackgroundColor: "rgba(153, 195, 146, 1)",
        pointHoverRadius: 5,
        pointRadius: 5,
      },
      {
        label: `${this.lastHeatingYear - 2}-${this.lastHeatingYear - 1} m.`,
        data: this.initMonthsDataset()[this.lastHeatingYear - 2],
        backgroundColor: ["rgba(222, 135, 71, 0.2)"],
        borderColor: ["rgba(222, 135, 71, 1)"],
        borderWidth: 1,
        pointHoverBackgroundColor: "rgba(255, 255, 255, 1)",
        pointHoverBorderColor: "rgba(222, 135, 71, 1)",
        pointBorderColor: "rgba(255, 255, 255, 1)",
        pointBackgroundColor: "rgba(222, 135, 71, 1)",
        pointHoverRadius: 5,
        pointRadius: 5,
      },
    ];
    if (!this.monthsChart) {
      this.monthsChart = new Chart(el, {
        type: "line",
        data: {
          labels: [
            "Spalis",
            "Lapkritis",
            "Gruodis",
            "Sausis",
            "Vasaris",
            "Kovas",
            "Balandis",
          ],
          datasets,
        },
        options: {
          tooltips: {
            caretSize: 0,
          },
          legend: {
            display: true,
          },
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "kWh/m²",
                },
                ticks: {
                  beginAtZero: false,
                },
              },
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Mėnuo",
                },
                gridLines: {
                  display: false,
                },
                ticks: {
                  beginAtZero: false,
                },
              },
            ],
          },
        },
      });
    } else {
      this.monthsChart.data.datasets = datasets;
      this.monthsChart.update();
    }
  }
  initHeatPriceGraphic() {
    const el = this.heatPriceChart.nativeElement.getContext("2d");
    // tslint:disable-next-line: no-unused-expression
    this.pricesChart && this.pricesChart.clear();
    const datasets = [
      {
        label: `${this.lastHeatingYear}-${this.lastHeatingYear + 1} m.`,
        data: this.initPriceDataset()[this.lastHeatingYear],
        backgroundColor: ["rgba(150, 106, 236, 0.2)"],
        borderColor: ["rgba(150, 106, 236, 1)"],
        borderWidth: 1,
        pointHoverBackgroundColor: "rgba(255, 255, 255, 1)",
        pointHoverBorderColor: "rgba(150, 106, 236, 1)",
        pointBorderColor: "rgba(255, 255, 255, 1)",
        pointBackgroundColor: "rgba(150, 106, 236, 1)",
        pointHoverRadius: 5,
        pointRadius: 5,
      },
      {
        label: `${this.lastHeatingYear - 1}-${this.lastHeatingYear} m.`,
        data: this.initPriceDataset()[this.lastHeatingYear - 1],
        backgroundColor: ["rgba(153, 195, 146, 0.2)"],
        borderColor: ["rgba(153, 195, 146, 1)"],
        borderWidth: 1,
        pointHoverBackgroundColor: "rgba(255, 255, 255, 1)",
        pointHoverBorderColor: "rgba(153, 195, 146, 1)",
        pointBorderColor: "rgba(255, 255, 255, 1)",
        pointBackgroundColor: "rgba(153, 195, 146, 1)",
        pointHoverRadius: 5,
        pointRadius: 5,
      },
      {
        label: `${this.lastHeatingYear - 2}-${this.lastHeatingYear - 1} m.`,
        data: this.initPriceDataset()[this.lastHeatingYear - 2],
        backgroundColor: ["rgba(222, 135, 71, 0.2)"],
        borderColor: ["rgba(222, 135, 71, 1)"],
        borderWidth: 1,
        pointHoverBackgroundColor: "rgba(255, 255, 255, 1)",
        pointHoverBorderColor: "rgba(222, 135, 71, 1)",
        pointBorderColor: "rgba(255, 255, 255, 1)",
        pointBackgroundColor: "rgba(222, 135, 71, 1)",
        pointHoverRadius: 5,
        pointRadius: 5,
      },
    ];
    if (!this.pricesChart) {
      this.pricesChart = new Chart(el, {
        type: "line",
        data: {
          labels: [
            "Spalis",
            "Lapkritis",
            "Gruodis",
            "Sausis",
            "Vasaris",
            "Kovas",
            "Balandis",
          ],
          datasets,
        },
        options: {
          tooltips: {
            caretSize: 0,
          },
          legend: {
            display: true,
          },
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "EUR/m²",
                },
                ticks: {
                  beginAtZero: false,
                },
              },
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Mėnuo",
                },
                gridLines: {
                  display: false,
                },
                ticks: {
                  beginAtZero: false,
                },
              },
            ],
          },
        },
      });
    } else {
      this.pricesChart.data.datasets = datasets;
      this.pricesChart.update();
    }
  }

  initMonthsDataset() {
    const dataset = {};
    this.heatingMonthsData.forEach((set) => {
      const att = set.attributes;
      dataset[att.SEZONAS] = [
        att.SPAL_KW ? parseFloat(att.SPAL_KW.toFixed(2)) : att.SPAL_KW,
        att.LAPKR_KW ? parseFloat(att.LAPKR_KW.toFixed(2)) : att.LAPKR_KW,
        att.GRUOD_KW ? parseFloat(att.GRUOD_KW.toFixed(2)) : att.GRUOD_KW,
        att.SAUS_KW ? parseFloat(att.SAUS_KW.toFixed(2)) : att.SAUS_KW,
        att.VASAR_KW ? parseFloat(att.VASAR_KW.toFixed(2)) : att.VASAR_KW,
        att.KOVAS_KW ? parseFloat(att.KOVAS_KW.toFixed(2)) : att.KOVAS_KW,
        att.BALAN_KW ? parseFloat(att.BALAN_KW.toFixed(2)) : att.BALAN_KW,
      ];
    });
    return dataset;
  }

  initPriceDataset() {
    const dataset = {};
    this.heatingMonthsData.forEach((set) => {
      const att = set.attributes;
      dataset[att.SEZONAS] = [
        att.SPAL_K ? parseFloat(att.SPAL_K.toFixed(2)) : att.SPAL_K,
        att.LAPKR_K ? parseFloat(att.LAPKR_K.toFixed(2)) : att.LAPKR_K,
        att.GRUOD_K ? parseFloat(att.GRUOD_K.toFixed(2)) : att.GRUOD_K,
        att.SAUS_K ? parseFloat(att.SAUS_K.toFixed(2)) : att.SAUS_K,
        att.VASAR_K ? parseFloat(att.VASAR_K.toFixed(2)) : att.VASAR_K,
        att.KOVAS_K ? parseFloat(att.KOVAS_K.toFixed(2)) : att.KOVAS_K,
        att.BALAN_K ? parseFloat(att.BALAN_K.toFixed(2)) : att.BALAN_K,
      ];
    });
    return dataset;
  }

  initClassesData() {
    const labels = this.heatingClassesData.classes.map(
      (label) => label + " klasė"
    );
    const data = {
      labels,
      datasets: [
        {
          label: "",
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 2,
        },
      ],
    };
    this.chartLabels = [];
    const dataset = data.datasets[0];
    this.heatingClassesData.classes.forEach((name) => {
      this.chartLabels.push(
        this.heatingClassesData.dataByClasses[name].label + ", viso pastatų: "
      );
      dataset.data.push(this.heatingClassesData.dataByClasses[name].count);
      dataset.backgroundColor.push(
        this.heatingClassesData.dataByClasses[name].color
      );
      dataset.borderColor.push(
        this.heatingClassesData.dataByClasses[name].strokeColor
      );
    });
    return data;
  }

  initHeatClassesGraphic() {
    const el = this.heatClassesChart.nativeElement.getContext("2d");
    // tslint:disable-next-line: no-unused-expression
    this.classesChart && this.classesChart.clear();
    const data = this.initClassesData();

    if (!this.classesChart) {
      this.classesChart = new Chart(el, {
        type: "bar",
        options: {
          tooltips: {
            position: "nearest",
            callbacks: {
              // bug: cutting off long label
              // solution: split label and add beforeTitle
              label: (tooltipItem, data) => {
                const label = ", viso pastatų: ";
                const result = data.datasets[0].data[tooltipItem.index];
                return label + result;
              },
              beforeTitle: (tooltipItems) => {
                return this.chartLabels[tooltipItems[0].index].split(",")[0];
              },
              // add empty string
              title: () => {
                return "";
              },
            },
          },
          legend: {
            display: false,
          },
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Namų skaičius",
                },
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Faktinio energijos suvartojimo klasė",
                },
                offset: true,
                gridLines: {
                  offsetGridLines: false,
                  display: false,
                },
                ticks: {
                  beginAtZero: false,
                },
              },
            ],
          },
        },
      });
      this.classesChart.data.labels = data.labels;
      this.classesChart.data.datasets = data.datasets;
      this.classesChart.update();
    } else {
      this.classesChart.data.labels = data.labels;
      this.classesChart.data.datasets = data.datasets;
      this.classesChart.update();
    }
  }

  ngOnChanges() {
    this.cdr.detectChanges();

    this.closeSidaberGroup();

    // close main heat content while adding animation
    this.innerState = "s-close";

    // check if heat data is emptyŠF
    if (this.sidebarHeatContent && this.mainSidebarState === "s-open") {
      // add setTimeout  for main heat content animation
      setTimeout(() => {
        this.innerState = "s-open";
        this.cdr.detectChanges();
      }, 200);

      this.lastHeatingYear = this.sidebarHeatContent.SEZONAS;

      if (this.sidebarHeatContent.REITING !== 0) {
        // add timeout for animation
        setTimeout(() => {
          this.showCharts = true;
          this.cdr.detectChanges();
        }, 200);

        // get data by months
        // pass layer number as first arg
        this.mapWidgetsService
          .queryHeatingDataByMonths(
            4,
            this.sidebarHeatContent.SEZONAS,
            this.sidebarHeatContent.ID_NAMO
          )
          .then((data) => {
            this.heatingMonthsData = data;
            // tslint:disable-next-line: no-unused-expression
            this.heatMonthsChart && this.initHeatMonthsGraphic();
            this.heatPriceChart && this.initHeatPriceGraphic();
          });

        // set data by house type and heat classes
        this.mapWidgetsService
          .queryHeatingDataByClasses(
            this.sidebarHeatContent.TIPINIS_PR,
            this.sidebarHeatContent.REITING
          )
          .then((data) => {
            this.heatingClassesData = data;
            // tslint:disable-next-line: no-unused-expression
            this.heatClassesChart && this.initHeatClassesGraphic();
          });
      } else {
        this.showCharts = false;
      }
    }
  }
}
