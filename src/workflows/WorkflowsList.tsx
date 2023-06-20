import React from "react";
import styled from "styled-components";
import { Button, Switch } from "grindery-ui";
import { Connector } from "../types/Connector";
import { CustomListItem } from "../components";
import { Workflow } from "../types/Workflow";
import { useAppDispatch } from "../store";
import { userStoreActions } from "../store/slices/userSlice";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  padding: 40px;
  gap: 20px;
`;

const ItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
`;

const ItemTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
`;

const Title = styled.span`
  position: relative;
  font-weight: 400;
  font-size: var(--text-size-list-item-label);
  line-height: 150%;
  color: #0b0d17;
  display: inline-block;
  padding-right: 24px;
  border-bottom: 1px dashed rgba(0, 0, 0, 0);
  cursor: text;

  &:hover {
    border-bottom: 1px dashed #898989;
  }
  &:hover:after {
    content: "";
    display: block;
    width: 12px;
    height: 12px;
    position: absolute;
    right: 1px;
    background-image: url(/images/icons/pencil.svg);
    background-position: center center;
    background-repeat: no-repeat;
    top: 5px;
  }
`;

const ItemAppsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 4px;
`;

const ItemAppWrapper = styled.div`
  padding: 4px;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
`;

const ItemAppIcon = styled.img`
  display: block;
  width: 16px;
  height: 16px;
`;

const ItemActionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 10px;
`;

type Props = {
  connectors: Connector[];
  workflows: Workflow[];
};

const WorkflowsList = (props: Props) => {
  const { connectors, workflows } = props;
  const dispatch = useAppDispatch();

  return (
    <Wrapper>
      <ItemsWrapper>
        {workflows.map((item) => (
          <WorkflowRow key={item.key} item={item} connectors={connectors} />
        ))}
      </ItemsWrapper>
      <Button
        value="Create New Workflow"
        onClick={() => {
          dispatch(userStoreActions.setCreate(true));
        }}
      />
    </Wrapper>
  );
};

type WorkflowRowProps = {
  item: any;
  connectors: Connector[];
};

const WorkflowRow = ({ item, connectors }: WorkflowRowProps) => {
  const title = item.title;
  const enabled = item.state === "on";
  const triggerIcon =
    connectors.find((t) => t.key === item.trigger?.connector)?.icon || null;

  const triggerAppName =
    connectors.find((t) => t.key === item.trigger?.connector)?.name || null;

  const actionsIcons = (item.actions || [])
    .map(
      (action: any) => connectors.find((a) => a.key === action.connector)?.icon
    )
    .filter((a: any) => a);

  const actionsAppName = (item.actions || [])
    .map(
      (action: any) => connectors.find((a) => a.key === action.connector)?.name
    )
    .filter((a: any) => a);

  return (
    <CustomListItem
      key={item.key}
      size="small"
      LeftComponent={
        <ItemTitleWrapper>
          <ItemAppsWrapper>
            {triggerIcon && (
              <ItemAppWrapper>
                <ItemAppIcon
                  src={triggerIcon}
                  alt="trigger app icon"
                  title={triggerAppName || ""}
                />
              </ItemAppWrapper>
            )}

            {actionsIcons.length > 0 &&
              actionsIcons.map((icon: any, i2: number) => (
                <ItemAppWrapper key={item.key + i2}>
                  <ItemAppIcon
                    src={icon}
                    alt="action app icon"
                    title={actionsAppName[i2] || ""}
                  />
                </ItemAppWrapper>
              ))}
          </ItemAppsWrapper>

          <Title
            style={{
              position: "relative",
              opacity: 1,
            }}
          >
            {title}
          </Title>
        </ItemTitleWrapper>
      }
      RightComponent={
        <ItemActionsWrapper>
          <Switch value={enabled} />
        </ItemActionsWrapper>
      }
    />
  );
};

export default WorkflowsList;
