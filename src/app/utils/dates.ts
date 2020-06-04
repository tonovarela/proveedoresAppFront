
import * as moment from 'moment';
 export  class FechaDictionary {  
     private _hoy: moment.Moment = moment();

     get today():Date{
         return this._hoy.toDate();
     }
     get weekStart():Date{
        return this._hoy.clone().weekday(1).toDate();
    }
    get weekEnd():Date{
        return this._hoy.clone().weekday(7).toDate();
    }
    get monthStart():Date{
        return this._hoy.clone().startOf('month').toDate();    
    }
    get monthEnd():Date{
        return this._hoy.clone().endOf('month').toDate();
    }
    get lastStart():Date{
        return this._hoy.clone().subtract(1, 'months').startOf('month').toDate()
    }
    get lastEnd():Date{
        return this._hoy.clone().subtract(1, 'months').endOf('month').toDate();
    }
        
};


  
 