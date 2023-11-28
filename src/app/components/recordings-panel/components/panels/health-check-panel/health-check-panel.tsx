import { faComputer } from '@fortawesome/free-solid-svg-icons/faComputer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spinner } from 'src/components/spinner';
import { useAsyncCall } from 'src/hooks/use-async-call';
import { florescctvClient } from 'src/services/florescctv-client';
import { ErrorMessage } from '../../error-message';

export function HealthCheckPanel (): JSX.Element {
  const {
    data,
    status,
    fetch: retry
  } = useAsyncCall({
    canRetry: true,
    params: [],
    fn: florescctvClient.cameras.getAllHealth
  });

  if (status === 'error') {
    return (
      <div className="util-perfect-center">
        <ErrorMessage
          message="Failed to load the health checks"
          onRetry={retry}
        />
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="util-perfect-center">
        <Spinner size="small" />
      </div>
    );
  }

  return (
    <>
      {
        data?.map(({
          ip,
          available_disk_space: availDiskSpace,
          available_memory: availMem,
          cpu_utilization: cpuUtil,
          cpu_temp: cpuTemp,
          gpu_temp: gpuTemp
        }) => (
          <div
            key={ip}
            className="util-mt-2 util-ml-2 util-mr-2"
          >
            <div className="util-flex-container">
              <FontAwesomeIcon
                icon={faComputer}
                size="3x"
              />
              <div className="util-ml-2">{ip}</div>
            </div>
            <div className="util-mt-1">
              <b>available disk space:</b> {availDiskSpace}
            </div>
            <div className="util-mt-1">
              <b>available memory:</b> {availMem}
            </div>
            <div className="util-mt-1">
              <b>cpu utilization:</b> {cpuUtil}
            </div>
            <div className="util-mt-1">
              <b>cpu temperature:</b> {cpuTemp}
            </div>
            <div className="util-mt-1 util-mb-3">
              <b>gpu temperature:</b> {gpuTemp}
            </div>
          </div>
        ))
      }
    </>
  );
}
