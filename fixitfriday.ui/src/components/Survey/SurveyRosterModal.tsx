import React, { FC, useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalFooter from 'react-bootstrap/ModalFooter';
import { SurveyClassType } from './types/SurveyClassType';
import { SurveyRosterProps } from './types/SurveyRosterProps';

const SurveyRoster: FC<SurveyRosterProps> = ({ surveys }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [radioChecked, setRadioChecked] = useState<string>('');
  // Set the first element checked
  useEffect(()=> {
    if (radioChecked === '' && surveys && surveys.length > 0) {
      setRadioChecked(surveys[0].surveyKey);
    }
  });

  const surveyOptions =
    surveys && surveys.length > 0 ? (
      surveys.map((s: SurveyClassType) => (
        <div key={s.surveyKey} id={s.surveyKey}>
          <input
            type="radio"
            key={s.surveyKey}
            id={s.surveyKey}
            checked={radioChecked === s.surveyKey}
            value={s.surveyKey}
            onChange={() => setRadioChecked(s.surveyKey)}
          />
          &nbsp;{s.surveyName}
        </div>
      ))
    ) : (
      <div />
    );
  // If the section does not have related surveys, the component is not shown
  return surveys && surveys.length > 0 ? (
    <div ref={React.createRef()} >
      <div id="modalSurveyShow" style={{ float: 'right' }}>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Class Survey Results
        </Button>
      </div>
      <Modal ref={React.createRef()} show={showModal} animation={false} centered>
        <ModalHeader>
          <ModalTitle>Class Survey Results</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Form.Group>{surveyOptions}</Form.Group>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Row style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <Col xs={3} />
            <Col xs={3}>
              <Button variant="danger" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Col>
            <Col xs={3}>
              <Button variant="primary" onClick={() => setShowModal(false)}>
                &nbsp;&nbsp;OK&nbsp;&nbsp;
              </Button>
            </Col>
            <Col xs={3} />
          </Row>
        </ModalFooter>
      </Modal>
    </div>
  ) : (
    <div />
  );
};

export default SurveyRoster;
