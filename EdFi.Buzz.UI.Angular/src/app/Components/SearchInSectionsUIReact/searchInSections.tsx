import * as React from 'react';
import { Section } from 'src/app/Models/section';

export interface SearchInSectionsComponentProps {
  sectionList: Section[];
  onSearch?: (sectionKey: string, studentFilter: string) => void;
  defaultValue?: string;
}

export function SearchInSections(props: SearchInSectionsComponentProps) {
  const sectionSelectionRef = React.createRef<HTMLSelectElement>();
  const studentFilterRef = React.createRef<HTMLInputElement>();
  const defaultValue = props.defaultValue || '';

  function searchEventHandler(e) {
    const sectionkey = sectionSelectionRef.current.value;
    const studentFilter = studentFilterRef.current.value;
    props.onSearch(sectionkey, studentFilter);
  }

  return <div className='card'>
    <div className='card-body' style={{ 'padding': '1rem' }}>
      <div className='row'>
        <div className='col-12 col-lg-12 form-group' style={{ 'marginBottom': 0 }}>
          <label><h4> Filters </h4> </label>
          <div className='input-group'>
            <select className='form-control' name='repeatSelect' id='sectionsSelect'
              value={defaultValue} ref={sectionSelectionRef} onChange={searchEventHandler}
            >
              <option value='null'>Select a section</option>
              {props.sectionList.map(si => <option value={si.sectionkey} key={si.sectionkey}>{si.sessionname}</option>)}
            </select>
            <input type='text' className='form-control' id='studentNameInputs'
              placeholder='Student Name' ref={studentFilterRef} onKeyUp={searchEventHandler} />
            <div className='input-group-append'>
              <button className='btn btn-primary' type='button' onClick={searchEventHandler}><label>Search</label><i
                className='ion ion-md-search'></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}
