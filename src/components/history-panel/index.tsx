import { ArrowUp } from "lucide-solid";
import { For, Show, createSignal } from "solid-js";

import { PageKeys } from "@/store/routes";
import { HistoryCore } from "@/domains/history";

export const HistoryPanel = (props: { store: HistoryCore<string, any> }) => {
  const { store } = props;

  const [state, setState] = createSignal(store.state);
  const [histories, setHistories] = createSignal(store.$router.histories);

  store.onStateChange((v) => {
    setState(v);
  });
  store.$router.onHistoriesChange((v) => {
    setHistories(v);
  });

  return (
    <div class="fixed left-2 bottom-2 right-2">
      <div class="h-[360px] border rounded-md p-4 bg-white">
        <div>
          <div class="px-4 py-2 rounded-xl bg-slate-100">{state().href}</div>
        </div>
        <div class="mt-4">
          <div>路由栈</div>
          <div class="mt-2 flex space-x-2 max-w-full overflow-x-auto">
            <For each={state().stacks}>
              {(stack, index) => {
                const { id, key, title, query } = stack;
                return (
                  <div class="relative p-2 border rounded-md bg-slate-100">
                    <div class="text-sm">{key}</div>
                    {/* <div class="text-sm">{id}</div> */}
                    <div class="text-slate-600" style={{ "font-size": "12px" }}>
                      {title}
                    </div>
                    <div class="my-2 p-2 max-h-[120px] rounded-md bg-slate-200" style="font-size: 12px;">
                      <pre>{query}</pre>
                    </div>
                    <Show when={index() === state().cursor}>
                      <div class="absolute bottom-0 left-1/2 -translate-x-1/2">
                        <ArrowUp class="w-6 h-6" />
                      </div>
                    </Show>
                  </div>
                );
              }}
            </For>
          </div>
        </div>
        <div class="mt-4 flex items-center space-x-4">
          <For each={histories()}>
            {(history, index) => {
              const { pathname } = history;
              return <div>{pathname}</div>;
            }}
          </For>
        </div>
      </div>
    </div>
  );
};
