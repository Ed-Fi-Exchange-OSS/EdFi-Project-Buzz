import * as React from 'react';
import styled from 'styled-components';
import { Section } from '../../Models/Section';

import ChevronDown from '../../assets/chevron-down.png';
import OrangeSearch from '../../assets/search.png';

export interface SearchInSectionsComponentProps {
  sectionList: Section[];
  onSearch?: (sectionKey: string, studentFilter: string) => void;
  defaultValue?: string;
}

const SearchInSectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-items: flex-start;
  margin-left:.2rem;
  margin-right:.2rem;
  margin-bottom: 1em;
  background-color: var(--white);
  max-width: 100%;
`;

const SearchContainer = styled.div`
  display: flex;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
  @media (min-width: 769px) {
    flex-direction: row;
    justify-content: flex-start;
  }
}
`;

const FilterByClassLabelDesktop = styled.span`

  font-size: 14px;

  @media (max-width: 768px) {
      display: none;
  }

  @media (min-width: 769px) {
    min-width: 8rem;
    color: var(--shark);
    font: ${(props) => props.theme.fonts.regular};
    font-weight: 600;
  }
`;

const FilterByClassLabel = styled.div`
  @media (min-width: 769px) {
      display: none;
  }

  @media (max-width: 768px) {
    color: var(--shark);
    width: fit-content;
    height: 16px;
    font: ${(props) => props.theme.fonts.regular};
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    margin: 0 0 1rem 0;
  }
`;

const StyledTextParent = styled.div`
  @media (max-width: 768px) {
    width: 100%;
  }
  @media (min-width: 769px) {
    max-width: fit-content;
    margin: 0.5rem 0.5rem 0.5rem 0.5rem;
    justify-content: center;
  }
  flex: 1;
  overflow: hidden;
  border: ${(props) => props.theme.border };
  border-radius: 4px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;

  :focus-within {
    outline: none !important;
    border-color: var(--denim) !important;
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
    min-width: 15rem;

    :focus {
      outline: none !important;
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
    margin: 0 0 0.5rem;
  }
  @media (min-width: 769px) {
    margin: 0.5rem 0.5rem 0.5rem 0;
    padding-left: 5px;
  }
  padding-top: 2px;
  padding-bottom: 7px;
  height: 3em;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  border: ${(props) => props.theme.border};
  border-radius: 4px;

  :focus-within {
    outline: none !important;
    border-color: var(--denim) !important;
  }

  & > select {
    min-width: 18em;
    width: 100%;
    height: 3rem;
    font: ${(props) => props.theme.fonts.bold};
    color: var(--denim);
    text-indent: 1px;
    text-overflow: '';
    appearance: none;
    --webkit-appearance: none;
    --moz-appearance: none;
    padding: 2px 2px 2px 3px;
    border: none;
    background: transparent url(${ChevronDown}) no-repeat 98% center;

    :focus {
      outline: none !important;
    }

  }

  & > select > option {
    font: ${(props) => props.theme.fonts.regular};
    font: ${(props) => props.theme.fonts.regular};
    font-weight: normal;
    color: var(--slate-gray);
  }
`;

export const SearchInSections: React.FunctionComponent<SearchInSectionsComponentProps> = (props: SearchInSectionsComponentProps) => {
  const sectionSelectionRef = React.createRef<HTMLSelectElement>();
  const studentFilterRef = React.createRef<HTMLInputElement>();
  const defaultValue = props.defaultValue || '';

  function searchEventHandler() {
    if (props.onSearch) {
      const studentFilter = studentFilterRef.current?.value ?? '';
      const sectionSelection = sectionSelectionRef.current?.value ?? '';
      props.onSearch(sectionSelection, studentFilter);
    }
  }

  return (
    <SearchInSectionsContainer>
      <FilterByClassLabel>Filter by Class</FilterByClassLabel>
      <SearchContainer>
        <StyledSelectParent id='sectionsSelectParent'>
          <FilterByClassLabelDesktop>Filter by Class:</FilterByClassLabelDesktop>
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
    </SearchInSectionsContainer>
  );
};
