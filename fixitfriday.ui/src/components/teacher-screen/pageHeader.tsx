import React, { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { TeacherClassType } from './types/TeacherClassType';

type PageHeaderProps = {
  TeacherName: string;
  TeacherClass: TeacherClassType[];
  onClassChange?(value: string): void;
};

const PageHeader: React.FunctionComponent<PageHeaderProps> = ({ TeacherName, TeacherClass, onClassChange }) => {
  const Options = TeacherClass.map((teacherClass) => (
    <option value={teacherClass.sectionkey} key={teacherClass.sectionkey}>
      {teacherClass.schoolyear} - {teacherClass.sessionname}
    </option>
  ));

  const [selectedClass, setSelectedClass] = React.useState<string>('');

  useEffect(() => {
    if (onClassChange) {
      onClassChange(selectedClass);
    }
  }, [selectedClass, onClassChange]);

  return (
    <>
      <Row>
        <Col>
          <h1>{TeacherName}</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Form>
            <Form.Group>
              <Form.Control as="select" value={selectedClass} size="sm" onChange={(e) => setSelectedClass(e.target.value)}>
                <option value="">Select a class</option>
                {Options}
              </Form.Control>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default PageHeader;
