interface BaseEvent {
    eventId: number;
    cowId: number;
    animalId: string;
    type: string;
    lactationNumber: number;
    daysInLactation: number;
    ageInDays: number;
    startDateTime: number;
    reportingDateTime: number;
    deletable: boolean;
}

interface HealthEvent extends BaseEvent {
    healthIndex?: number;
    minValueDateTime?: number;
    endDate?: number | null;
}

interface HeatEvent extends BaseEvent {
    heatIndexPeak: string;
}

interface BreedingEvent extends BaseEvent {
    sire: string | null;
    breedingNumber: number;
    isOutOfBreedingWindow: boolean;
    interval: number;
}

interface ChangeGroupEvent extends BaseEvent {
    newGroupId: number;
    newGroupName: string;
    currentGroupId: number | null;
    currentGroupName: string | null;
}

interface DryOffEvent extends BaseEvent {
    destinationGroup: number;
    destinationGroupName: string;
    daysInPregnancy: number;
}

interface DistressEvent extends BaseEvent {
    alertType: string;
    duration: number;
    originalStartDateTime?: number | null;
    endDateTime?: number | null;
    daysInPregnancy?: number | null;
}

interface BirthEvent extends BaseEvent {
    birthDateCalculated: boolean;
}

interface CalvingEvent extends BaseEvent {
    daysInPregnancy: number;
    destinationGroup: string;
    destinationGroupName: string;
    calvingEase: string;
    oldLactationNumber: number;
    newborns: number;
}

interface HerdEntryEvent extends BaseEvent {
    destinationGroup: string;
    destinationGroupName: string;
    cowEntryStatus: string;
}

export type CommonEvent =
    | HealthEvent
    | HeatEvent
    | BreedingEvent
    | ChangeGroupEvent
    | DryOffEvent
    | DistressEvent
    | BirthEvent
    | CalvingEvent
    | HerdEntryEvent
