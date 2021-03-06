import React from "react";
import ObservableTable from "./ObservableTable";
import { BehaviorSubject, combineLatest } from "rxjs";
import { map, shareReplay } from "rxjs/operators";



const ObservableTableList = React.memo(props =>{

    const page = (props.page || new BehaviorSubject(0));
    const rowsPerPage = (props.rowsPerPage || new BehaviorSubject(10));
  
    const pageData = React.useMemo(()=>combineLatest(props.list, page, rowsPerPage)
      .pipe(map(([list, page, rowsPerPage]) =>{
          if (rowsPerPage == 0) return list;
          const subList = list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
          return subList;
      }),
      shareReplay({
          bufferSize: 1,
          refCount: true
      })
    ),[props.list, page, rowsPerPage]);


    const count = React.useMemo(()=>props.list.pipe(map(list => list.length)),[props.list]);
  
    return (
      <ObservableTable headers={props.headers} rowComponent={props.rowComponent} list={pageData} page={page} count={count} rowsPerPage={rowsPerPage}/>
    )
  })
  

  export default ObservableTableList;