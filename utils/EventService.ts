import { createNanoEvents, Emitter, Unsubscribe } from 'nanoevents';

interface Events {
  [key: string]: any;
}

class EventService {
  private static instance: EventService;
  private emitter: Emitter<Events>;

  private constructor() {
    this.emitter = createNanoEvents<Events>();
  }

  public static getInstance(): EventService {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }
    return EventService.instance;
  }

  public subscribe(event: string, callback: (data: any) => void): Unsubscribe {
    return this.emitter.on(event, callback);
  }

  public publish(event: string, data: any): void {
    this.emitter.emit(event, data);
  }

  public unsubscribe(subscription: Unsubscribe): void {
    subscription();
  }
}

export default EventService.getInstance();
