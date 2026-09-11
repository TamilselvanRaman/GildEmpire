import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const groups = [
      {
        groupId: 'GROUP-001',
        groupName: 'Sovereign Batch A',
        status: 'active',
        totalMembers: 50,
        filledMembers: 50,
        startDate: '2026-08-14',
        currentCycleDay: 28,
        totalWinners: 28,
      },
      {
        groupId: 'GROUP-002',
        groupName: 'Royal Crest Batch B',
        status: 'recruiting',
        totalMembers: 50,
        filledMembers: 34,
        startDate: '2026-09-01',
        currentCycleDay: 0,
        totalWinners: 0,
      },
      {
        groupId: 'GROUP-003',
        groupName: 'Imperial Gold Batch C',
        status: 'upcoming',
        totalMembers: 50,
        filledMembers: 12,
        startDate: '2026-10-01',
        currentCycleDay: 0,
        totalWinners: 0,
      },
    ];

    return NextResponse.json({
      success: true,
      groups,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch groups data' },
      { status: 500 }
    );
  }
}
