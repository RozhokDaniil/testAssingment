import { HttpInterceptorFn, HttpResponse } from '@angular/common/http'
import data from '../data.json';
import { of } from 'rxjs';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
    const authReq = req.clone();

    const url = req.url;
    const method = req.method;

    if (method === 'GET' && url === '/api/data') {
        return of(new HttpResponse({ status: 200, body: data }))
    }

    if (method === 'POST' && url === '/api/data') {
        const newItem = req.body;
        data.push(newItem as any);
        return of(new HttpResponse({ status: 201, body: newItem }))
    }


    if (method === 'PUT' && url === '/api/data') {
        const updatedItem: any = req.body as any;
        const index = data.findIndex(item => item.eventId === updatedItem.eventId);
        if (index > -1) {
            data[index] = updatedItem;
            return of(new HttpResponse({ status: 200, body: updatedItem }));
        } else {
            return of(new HttpResponse({ status: 404, body: { message: 'Item not found' } }));
        }
    }


    if (method === 'DELETE' && url === '/api/data') {
        const { eventId }: { eventId: number } = req.body as { eventId: number }; 
        const index = data.findIndex(item => item.eventId === eventId);
        if (index > -1) {
            data.splice(index, 1);
            return of(new HttpResponse({ status: 200 }));
        } else {
            return of(new HttpResponse({ status: 404, body: { message: 'Item not found' } }));
        }
    }



    return next(authReq);
}