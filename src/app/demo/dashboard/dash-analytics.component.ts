// angular import
import { Component, viewChild } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProductSaleComponent } from './product-sale/product-sale.component';

// 3rd party import

import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from './services/dashboard.service';
import { BranchComparisonStats, BranchdashboardService, BranchDashboardStats } from './services/branchdashboard.service';

@Component({
  selector: 'app-dash-analytics',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule, ProductSaleComponent],
  templateUrl: './dash-analytics.component.html',
  styleUrls: ['./dash-analytics.component.scss']
})
export default class DashAnalyticsComponent {
  stats: BranchDashboardStats | null = null;
  branchComparison: BranchComparisonStats[] = [];
  loading = true;
  isAdmin = false;
  currentDate = new Date();

  // Chart configurations
  loanStatusChart: any = {};
  branchComparisonChart: any = {};
  activityTimeline: any[] = [
    { time: '10:42 AM', activity: 'New SME loan application', icon: 'bi-file-earmark-text', color: 'primary' },
    { time: '10:30 AM', activity: 'HP product added', icon: 'bi-cart-plus', color: 'success' },
    { time: 'Yesterday', activity: '3 new customers registered', icon: 'bi-person-plus', color: 'info' },
    { time: 'Mar 28', activity: 'System maintenance completed', icon: 'bi-gear', color: 'warning' }
  ];

  constructor(private dashboardService: BranchdashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
    if (this.isAdmin) {
      this.loadComparisonData();
    }
  }

  loadDashboardData(): void {
    this.loading = true;
    this.dashboardService.getBranchStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.initLoanStatusChart();
        setTimeout(() => {
          this.loading = false;
        }, 800); // Slight delay for smooth transition
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadComparisonData(): void {
    this.dashboardService.getAllBranchesComparison().subscribe(data => {
      this.branchComparison = data;
      this.initComparisonChart();
    });
  }

  initLoanStatusChart(): void {
    if (!this.stats) return;
    
    this.loanStatusChart = {
      series: [
        this.stats.activeSmeLoanCount,
        this.stats.pendingSmeLoanCount,
        this.stats.smeLoanCount - this.stats.activeSmeLoanCount - this.stats.pendingSmeLoanCount
      ],
      chart: {
        type: 'donut',
        height: 350,
        animations: {
          enabled: true,
          easing: 'easeout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          }
        }
      },
      labels: ['Active Loans', 'Pending Loans', 'Other Status'],
      colors: ['#2ed8b6', '#FFB64D', '#FF5370'],
      legend: {
        position: 'bottom',
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Loans',
                color: '#6c757d'
              }
            }
          }
        }
      }
    };
  }

  initComparisonChart(): void {
    this.branchComparisonChart = {
      series: [
        {
          name: 'Customers',
          data: this.branchComparison.map(b => b.cifCount)
        },
        {
          name: 'Active Customers',
          data: this.branchComparison.map(b => b.activeCifCount)
        },
        {
          name: 'SME Loans',
          data: this.branchComparison.map(b => b.smeLoanCount)
        },
        {
          name: 'HP Registrations',
          data: this.branchComparison.map(b => b.hpRegistrationCount)
        }
      ],
      chart: {
        type: 'bar',
        height: 350,
        stacked: false,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4,
          borderRadiusApplication: 'end'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: this.branchComparison.map(b => b.branchName)
      },
      yaxis: {
        title: {
          text: 'Count',
          style: {
            color: '#6c757d'
          }
        }
      },
      fill: {
        opacity: 1,
        colors: ['#5e72e4', '#2dce89', '#fb6340', '#11cdef']
      },
      tooltip: {
        y: {
          formatter: function(val: number) {
            return val.toString();
          }
        }
      }
    };
  }

  getStatusPercentage(current: number, total: number): string {
    return total > 0 ? ((current / total) * 100).toFixed(1) + '%' : '0%';
  }

  getStatusClass(percentage: string): string {
    const value = parseFloat(percentage);
    if (value >= 70) return 'bg-success';
    if (value >= 40) return 'bg-info';
    return 'bg-warning';
  }
}
