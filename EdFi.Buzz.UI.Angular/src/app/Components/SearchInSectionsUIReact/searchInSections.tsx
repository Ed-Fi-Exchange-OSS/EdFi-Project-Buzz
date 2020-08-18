import { Section } from 'src/app/Models/section';
import * as React from 'react';
import styled from 'styled-components';

import ChevronDown from '../../../assets/chevron-down.png';
import OrangeSearch from '../../../assets/search.png';

export interface SearchInSectionsComponentProps {
  sectionList: Section[];
  onSearch?: (sectionKey: string, studentFilter: string) => void;
  defaultValue?: string;
}

const SearchContainer = styled.div`
  display: flex;
  @media (max-width: 768px) {
    flex-direction: column;
  }
  @media (min-width: 769px) {
    flex-direction: row;
    justify-content: flex-start;
  }
`;

const FilterByClassLabel = styled.label`
  color: ${(props) => props.theme.colors.darkgray};
  height: 16px;
  font-family: ${(props) => props.theme.fonts.regular};
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
`;

const StyledTextParent = styled.div`
  @media (max-width: 768px) {
    width: 100%;
  }
  @media (min-width: 769px) {
    max-width: 22rem;
    margin: 0.5rem 0.5rem 0.5rem 0.5rem;
  }
  flex: 1;
  overflow: hidden;
  border: solid 2px ${(props) => props.theme.colors.lightgray};
  border-radius: 4px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  :focus-within {
    border-color: ${(props) => props.theme.colors.steelblue} !important;
  }

  & > img {
    height: 18px;
    width: 18px;
    margin: 10px 10px 10px 10px;
  }

  & > input {
    height: 100%;
    padding: 2px 2px 2px 2px;
    border: none;
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
  @media (max-width: 768px) {
    width: 100%;
    margin: 0 0 0.5rem 0;
  }
  @media (min-width: 769px) {
    max-width: 22rem;
    margin: 0.5rem 0.5rem 0.5rem 0;
  }
  flex: 1;
  overflow: hidden;
  border: ${(props) => props.theme.border};
  border-radius: 4px;
  margin-bottom: 5px;

  :focus-within {
    border-color: ${(props) => props.theme.colors.steelblue} !important;
  }

  & > select {
    height: 3em;
    font-family: ${(props) => props.theme.fonts.bold};
    color: ${(props) => props.theme.colors.steelblue};
    text-indent: 1px;
    text-overflow: '';
    width: 100%;
    appearance: none;
    --webkit-appearance: none;
    --moz-appearance: none;
    padding: 2px 2px 2px 3px;
    border: none;
    background: transparent url(${ChevronDown}) no-repeat 98% center;
  }

  & > select > option {
    font: ${(props) => props.theme.fonts.regular};
    font-family: ${(props) => props.theme.fonts.regular};
    font-weight: normal;
    color: ${(props) => props.theme.colors.gray};
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
      <FilterByClassLabel>Filter by Class</FilterByClassLabel>
      <SearchContainer className='input-group'>
        <StyledSelectParent id='sectionsSelectParent'>
          <select
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
      </SearchContainer>
    </div>
  );
}
