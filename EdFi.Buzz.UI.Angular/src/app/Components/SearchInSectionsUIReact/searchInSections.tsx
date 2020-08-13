import { Section } from 'src/app/Models/section';
import * as React from 'react';
import styled from 'styled-components';

import ChevronDown from '../../../../assets/chevron-down.png';
import OrangeSearch from '../../../../assets/search.png';

export interface SearchInSectionsComponentProps {
  sectionList: Section[];
  onSearch?: (sectionKey: string, studentFilter: string) => void;
  defaultValue?: string;
}

const FilterByClassLabel = styled.label`
  color: ${ props => props.theme.colors.darkgray };
  height: 16px;
  font-family: ${ props => props.theme.fonts.regular };
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
`;

const StyledTextParent = styled.div`
  display: flex;
  height: 44px;
  width: 100%;
  overflow: hidden;
  border: solid 2px ${ props => props.theme.colors.lightgray };
  border-radius: 4px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  :focus-within {
      border-color: ${ props => props.theme.colors.steelblue } !important;
  }

  & > img {
    height: 18px;
    width: 18px;
    margin: 10px 10px 10px 10px;
  }

  & > input {
    height: 100%;
    padding: 2px 2px 2px 2px;
    border:none;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    display: table-cell;

    :focus {
      outline-width: 0px;
    }

    ::placeholder,
    ::-webkit-input-placeholder {
      font-style: italic;
    }

    :-moz-placeholder {
      font-style: italic;
    }

    ::-moz-placeholder {
      font-style: italic;
    }

    :-ms-input-placeholder {
      font-style: italic;
    }
  }
`;

const StyledSelectParent = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  border: ${ props => props.theme.border };
  border-radius: 4px;
  margin-bottom: 5px;

  :focus-within {
      border-color: ${ props => props.theme.colors.steelblue } !important;
  }

  & > select {
    font-family: ${ props => props.theme.fonts.bold };
    font-weight: bold;
    color: ${ props => props.theme.colors.steelblue };
    text-indent: 1px;
    text-overflow: "";
    width: 100%;
    appearance: none;
    --webkit-appearance: none;
    --moz-appearance: none;
    padding: 2px 2px 2px 3px;
    border: none;
    background: transparent url(${ChevronDown}) no-repeat 98% center;
  }

  & > select > option {
    font-family: ${ props => props.theme.fonts.regular };
    font-weight: normal;
    color: ${ props => props.theme.colors.gray};
  }
`;

export function SearchInSections(props: SearchInSectionsComponentProps) {
  const sectionSelectionRef = React.createRef<HTMLSelectElement>();
  const studentFilterRef = React.createRef<HTMLInputElement>();
  const defaultValue = props.defaultValue || '';

  function searchEventHandler(e) {
    const studentFilter = studentFilterRef.current.value;
    const sectionSelection = sectionSelectionRef.current.value;
    props.onSearch(sectionSelection, studentFilter);
  }

  return (
    <div>
      <div>
        <div>
          <div>
            <FilterByClassLabel>Filter by Class</FilterByClassLabel>
            <div className='input-group'>
              <StyledSelectParent id='sectionsSelectParent'>
                <select
                  className='form-control'
                  name='repeatSelect'
                  id='sectionsSelect'
                  value={defaultValue}
                  ref={sectionSelectionRef}
                  onChange={searchEventHandler}
                >
                  <option value='null'>Select a section</option>
                  {props.sectionList.map((si) => (
                    <option value={si.sectionkey} key={si.sectionkey}>
                      {si.sessionname}
                    </option>
                  ))}
                </select>
              </StyledSelectParent>
              <StyledTextParent>
                <img src={OrangeSearch} />
                <input
                  type='text'
                  id='studentNameInputs'
                  placeholder='Search by Student Name'
                  ref={studentFilterRef}
                  onKeyUp={searchEventHandler}
                />
              </StyledTextParent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
