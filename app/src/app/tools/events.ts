export const debounce = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
	) => {
	  let timeoutTimer: ReturnType<typeof setTimeout>;

	  return (...args: T) => {
	    clearTimeout(timeoutTimer);

	    timeoutTimer = setTimeout(() => {
	      callback(...args);
	    }, delay);
	  };
  }


export const delayLoading = <T extends unknown[]>(callback: (...args: T) => TimerHandler, delay: number) => {
  const timeout = setTimeout(callback, delay)

  return (callbackEnd: () => void) => {

    clearTimeout(timeout)
    callbackEnd()
  }
}

