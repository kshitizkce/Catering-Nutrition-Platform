import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { AdminDashboardService, AdminDashboard } from '../services/admindashboard/admin-dashboard';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements AfterViewInit {

  dashboard?: AdminDashboard;
  chart: any;

  constructor(
    private dashboardService: AdminDashboardService,
    private cdr: ChangeDetectorRef  // <-- inject ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboard = data;

        // Force Angular to detect changes after async data update
        this.cdr.detectChanges();

        const labels = data.revenueByDay.map(x => x.day);
        const revenueData = data.revenueByDay.map(x => x.revenue);

        this.createChart(labels, revenueData);
      },
      error: (err) => {
        console.error('Error loading dashboard', err);
      }
    });
  }

  createChart(labels: string[], data: number[]) {

    const ctx = document.getElementById('revenueChart') as any;

    // destroy old chart if exists
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels, // ✅ dynamic week days
        datasets: [{
          label: 'Revenue',
          data: data,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },

        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#e5e7eb'
            }
          }
        }
      }
    });
  }
}