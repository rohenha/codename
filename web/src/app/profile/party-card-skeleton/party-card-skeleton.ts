import { Component } from '@angular/core';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';

@Component({
  selector: 'app-party-card-skeleton',
  imports: [ZardSkeletonComponent],
  templateUrl: './party-card-skeleton.html',
  styleUrl: './party-card-skeleton.css',
})
export class PartyCardSkeleton {}
