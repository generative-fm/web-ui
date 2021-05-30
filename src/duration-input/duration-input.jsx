import React, { useState, useCallback, useRef, useEffect } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import convertDurationToStringValue from './convert-duration-to-string-value';
import convertStringValueToDuration from './convert-string-value-to-duration';
import DurationInputDigit from './duration-input-digit';
import styles from './duration-input.module.scss';

const DurationInput = (props) => {
  const { value, onChange, onFocus, isAutoFocused } = props;
  const [isEditing, setIsEditing] = useState(isAutoFocused);
  const [cursorIndex, setCursorIndex] = useState(0);
  const inputRef = useRef(null);
  const [stringValue, setStringValue] = useState(
    convertDurationToStringValue(value)
  );

  const handleBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      event.preventDefault();
      if (/^\d$/.test(event.key)) {
        if (stringValue.length < 6) {
          setCursorIndex((previousIndex) => Math.min(previousIndex + 1, 6));
        }
        const chars = stringValue.split('');
        chars.splice(cursorIndex, 0, event.key);
        setStringValue(chars.join('').slice(-6));
        return;
      }
      if (event.key === 'Backspace' && cursorIndex > 0) {
        setCursorIndex((previousValue) => previousValue - 1);
        const chars = stringValue.split('');
        chars.splice(cursorIndex - 1, 1);
        setStringValue(chars.join(''));
        return;
      }
      if (event.key === 'Delete' && cursorIndex < stringValue.length) {
        const chars = stringValue.split('');
        chars.splice(cursorIndex, 1);
        setStringValue(chars.join(''));
        return;
      }
      if (event.key === 'ArrowLeft' && cursorIndex > 0) {
        setCursorIndex((previousIndex) => previousIndex - 1);
        return;
      }
      if (event.key === 'ArrowRight' && cursorIndex < stringValue.length) {
        setCursorIndex((previousIndex) => previousIndex + 1);
      }
    },
    [stringValue, setStringValue, cursorIndex]
  );

  const handleDigitClick = useCallback(
    (reverseIndex) => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      if (isEditing) {
        setCursorIndex(Math.max(stringValue.length - reverseIndex, 0));
        return;
      }
      setIsEditing(true);
      setCursorIndex(stringValue.length);
    },
    [stringValue.length, isEditing]
  );

  const handleClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setIsEditing(true);
    setCursorIndex(stringValue.length);
  }, [stringValue.length]);

  const handleMouseDown = useCallback((event) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    if (isEditing) {
      return;
    }
    setStringValue(convertDurationToStringValue(value));
  }, [value, isEditing]);

  useEffect(() => {
    onChange(convertStringValueToDuration(stringValue));
  }, [onChange, stringValue]);

  return (
    <div
      className={classnames(styles['duration-input'], {
        [styles['duration-input--is-editing']]: isEditing,
      })}
      onClick={handleClick}
      onBlur={handleBlur}
      onMouseDown={handleMouseDown}
    >
      <DurationInputDigit
        fullValue={stringValue}
        reverseIndex={5}
        cursorIndex={cursorIndex}
        isEditing={isEditing}
        onClick={handleDigitClick}
      />
      <DurationInputDigit
        fullValue={stringValue}
        reverseIndex={4}
        cursorIndex={cursorIndex}
        isEditing={isEditing}
        onClick={handleDigitClick}
      />
      <div
        className={classnames(styles['duration-input__unit'], {
          [styles['duration-input__unit--is-user-input']]:
            stringValue.length >= 5,
        })}
      >
        h
      </div>
      <DurationInputDigit
        fullValue={stringValue}
        reverseIndex={3}
        cursorIndex={cursorIndex}
        isEditing={isEditing}
        onClick={handleDigitClick}
      />
      <DurationInputDigit
        fullValue={stringValue}
        reverseIndex={2}
        cursorIndex={cursorIndex}
        isEditing={isEditing}
        onClick={handleDigitClick}
      />
      <div
        className={classnames(styles['duration-input__unit'], {
          [styles['duration-input__unit--is-user-input']]:
            stringValue.length >= 3,
        })}
      >
        m
      </div>
      <DurationInputDigit
        fullValue={stringValue}
        reverseIndex={1}
        cursorIndex={cursorIndex}
        isEditing={isEditing}
        onClick={handleDigitClick}
      />
      <DurationInputDigit
        fullValue={stringValue}
        reverseIndex={0}
        cursorIndex={cursorIndex}
        isEditing={isEditing}
        onClick={handleDigitClick}
      />
      <div
        className={classnames(styles['duration-input__unit'], {
          [styles['duration-input__unit--is-user-input']]:
            stringValue.length >= 1,
        })}
      >
        s
      </div>
      <input
        className={styles['duration-input__input']}
        pattern="\d*"
        type="number"
        maxLength="6"
        ref={inputRef}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        data-cy={props['data-cy']}
        autoFocus={isAutoFocused}
      />
    </div>
  );
};

DurationInput.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  isAutoFocused: PropTypes.bool,
};

export default DurationInput;
